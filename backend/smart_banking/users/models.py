# Create  models here.
from django.contrib.auth.models import AbstractUser, User
from django.db import models
from .tracker import AccountNumberTracker

from smart_banking.settings import AUTH_USER_MODEL


# Address Model
class Address(models.Model):
    addressID = models.AutoField(primary_key=True)
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    provinces = models.CharField(max_length=100)
    district = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.street}, {self.city}, {self.district}, {self.provinces}"

# Admin Model
class Admin(models.Model):
    adminID = models.AutoField(primary_key=True)
    department = models.CharField(max_length=100)
    salary = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Admin {self.adminID} - {self.department}"

# AccountType Model
class AccountType(models.Model):
    accountTypeID = models.AutoField(primary_key=True)
    depositType = models.CharField(max_length=100)
    depositRates = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"{self.depositType} ({self.depositRates}%)"

# Loans Model
class Loans(models.Model):
    loanID = models.AutoField(primary_key=True)
    loanTypes = models.CharField(max_length=100)
    interestRates = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"{self.loanTypes} ({self.interestRates}%)"

# TransactionType Model
class TransactionType(models.Model):
    TRANSACTION_CHOICES = [
        ("withdraw", "Withdraw"),
        ("deposit", "Deposit"),
        ("transfer", "Transfer"),
    ]
    transactionTypeID = models.AutoField(primary_key=True)
    transactionType = models.CharField(max_length=10, choices=TRANSACTION_CHOICES, unique=True)

    def __str__(self):
        return self.transactionType

# Transactions Model
class Transactions(models.Model):
    transactionID = models.AutoField(primary_key=True)
    date = models.DateTimeField(auto_now_add=True)
    reference = models.CharField(max_length=255)
    description = models.TextField()
    transactionTypeID = models.ForeignKey(TransactionType, on_delete=models.CASCADE)

    def __str__(self):
        return f"Transaction {self.transactionID} - {self.reference}"

# Account Model
class Account(models.Model):
    accountNumber = models.BigIntegerField(primary_key=True, unique=True)
    accountTypeID = models.ForeignKey(AccountType, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=15, decimal_places=2)
    loanID = models.ForeignKey('Loans', on_delete=models.SET_NULL, null=True, blank=True)
    transactionID = models.ForeignKey('Transactions', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Account {self.accountNumber}"
    
    def save(self, *args, **kwargs):
        if not self.accountNumber:  
            # Get the highest existing accountNumber
            last_account = Account.objects.order_by('-accountNumber').first()
            last_number = last_account.accountNumber if last_account else 999999  # Start from 1000000
            self.accountNumber = last_number + 1
        super().save(*args, **kwargs)

# Customers Model
class Customers(models.Model):
    customerID = models.AutoField(primary_key=True)
    beneficiary = models.CharField(max_length=255)
    #accountID = models.ForeignKey(Account, on_delete=models.CASCADE)

    def __str__(self):
        return  {self.customerID} , {self.beneficiary}

# Users Model
class User(AbstractUser):
    userID = models.AutoField(primary_key=True)
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    phoneNumber = models.CharField(max_length=15,unique=True, null=False, blank=False)
    addressID = models.ForeignKey(Address, on_delete=models.CASCADE)
    adminID = models.ForeignKey(Admin, on_delete=models.SET_NULL, null=True, blank=True)
    customerID = models.ForeignKey(Customers, on_delete=models.SET_NULL, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    email = models.EmailField(unique=True)
    dateOfBirth = models.DateField()
    panNumber = models.CharField(max_length=20, unique=True)
    
    USERNAME_FIELD = "phoneNumber"  # Login with email
    REQUIRED_FIELDS = [""]


    def __str__(self):
        return {self.firstName}, {self.lastName}, {self.email}, {self.panNumber}
