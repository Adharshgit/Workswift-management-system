from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Shift, SwapRequest
from .serializers import ShiftSerializer, SwapRequestSerializer
from django.db import transaction

class IsManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'manager'

class ShiftViewSet(viewsets.ModelViewSet):
    queryset = Shift.objects.all()
    serializer_class = ShiftSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsManager()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Shift.objects.none()
        if user.role == 'manager':
            return Shift.objects.all()
        return Shift.objects.filter(employee=user)

class SwapRequestViewSet(viewsets.ModelViewSet):
    queryset = SwapRequest.objects.all()
    serializer_class = SwapRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(requesting_employee=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return SwapRequest.objects.none()
        if user.role == 'manager':
            return SwapRequest.objects.all()
        return SwapRequest.objects.filter(requesting_employee=user) | SwapRequest.objects.filter(requested_employee=user)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        swap = self.get_object()
        if request.user != swap.requested_employee:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        swap.status = 'accepted'
        swap.save()
        return Response({'status': 'accepted'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        swap = self.get_object()
        if request.user != swap.requested_employee and request.user.role != 'manager':
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        
        swap.status = 'rejected'
        swap.save()
        return Response({'status': 'rejected'})

    @action(detail=True, methods=['post'], permission_classes=[IsManager])
    def approve(self, request, pk=None):
        swap = self.get_object()
        if swap.status != 'accepted':
            return Response({'error': 'Swap must be accepted by employee first'}, status=status.HTTP_400_BAD_REQUEST)
        
        with transaction.atomic():
            s1 = swap.requesting_shift
            s2 = swap.target_shift
            
            s1_original_employee = s1.employee
            
            s1.employee = swap.requested_employee
            s1.save()
            
            if s2:
                s2.employee = s1_original_employee # s2 belonged to requested_employee, now to requesting (original)
                s2.save()

            swap.status = 'approved'
            swap.save()
            
        return Response({'status': 'approved'})
