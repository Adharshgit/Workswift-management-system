from django.db import models
from django.conf import settings

class Shift(models.Model):
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    employee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='shifts')

    def __str__(self):
        return f"{self.date} {self.start_time}-{self.end_time} ({self.employee})"

class SwapRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    requesting_employee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_swaps')
    requested_employee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_swaps')
    requesting_shift = models.ForeignKey(Shift, on_delete=models.CASCADE, related_name='outgoing_swaps')
    target_shift = models.ForeignKey(Shift, on_delete=models.SET_NULL, null=True, blank=True, related_name='incoming_swaps')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Swap {self.requesting_shift} with {self.requested_employee} ({self.status})"
