# users/tracker.py
from django.db import models

class AccountNumberTracker(models.Model):
    last_account_number = models.PositiveIntegerField(default=100000)