# users/tracker.py
from django.db import models

class AccountNumberTracker(models.Model):
    id = models.AutoField(primary_key=True)
    last_account_number = models.PositiveIntegerField(default=100000)
    
    def __str__(self):
        return f"Tracker {self.id} - Last Account Number: {self.last_account_number}"