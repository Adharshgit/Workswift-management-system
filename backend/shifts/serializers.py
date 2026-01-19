from rest_framework import serializers
from .models import Shift, SwapRequest
from users.serializers import UserSerializer

class ShiftSerializer(serializers.ModelSerializer):
    employee_details = UserSerializer(source='employee', read_only=True)

    class Meta:
        model = Shift
        fields = '__all__'
        extra_kwargs = {'employee': {'required': True}}

class SwapRequestSerializer(serializers.ModelSerializer):
    requesting_employee_details = UserSerializer(source='requesting_employee', read_only=True)
    requested_employee_details = UserSerializer(source='requested_employee', read_only=True)
    requesting_shift_details = ShiftSerializer(source='requesting_shift', read_only=True)
    target_shift_details = ShiftSerializer(source='target_shift', read_only=True)

    class Meta:
        model = SwapRequest
        fields = '__all__'
        read_only_fields = ('status', 'requesting_employee', 'created_at')

    def validate(self, data):
        return data
