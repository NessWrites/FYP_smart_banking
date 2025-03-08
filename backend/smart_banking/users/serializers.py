from rest_framework import serializers
from .models import User, AccountType, Transactions, TransactionType

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'firstName', 'lastName', 'address', 'district', 'city', 'province',
#                   'dateOfBirth', 'panNumber', 'email', 'phone', 'username', 'accountNumber']
#         extra_kwargs = {'password': {'write_only': True}}

#     def create(self, validated_data):
#         request = self.context.get('request')
#         if request and not request.user.is_staff:
#             raise serializers.ValidationError("Only admins can create users.")
#         return super().create(validated_data)

# class AccountTypeSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = AccountType
#         fields = '__all__'

# class TransactionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Transaction
#         fields = '__all__'

# class TransactionTypeSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = TransactionType
#         fields = '__all__'


# class ChatRequestSerializer(serializers.Serializer):
#     message = serializers.CharField(max_length=3024)

# class ChatResponseSerializer(serializers.Serializer):
#     response = serializers.CharField()

from rest_framework import serializers
from .models import (
    Address, Admin, AccountType, Loans, TransactionType,
    Account, Customers, User, Transactions
)

# Address Serializer
class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'

# Admin Serializer
class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = '__all__'

# AccountType Serializer
class AccountTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountType
        fields = '__all__'

# Loans Serializer
class LoansSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loans
        fields = '__all__'

# TransactionType Serializer
class TransactionTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionType
        fields = '__all__'

# Account Serializer
class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'

# Customers Serializer
class CustomersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customers
        fields = '__all__'

# Users Serializer
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    addressID = AddressSerializer(read_only=True)
    adminID = AdminSerializer(read_only=True)
    customerID = CustomersSerializer(read_only=True)

    class Meta:
        model = User
        fields = '__all__'

    def validate_panNumber(self, value):
        if not value.isalnum() or len(value) != 10:
            raise serializers.ValidationError("PAN number must be 10 characters long and alphanumeric.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            firstName=validated_data['firstName'],
            lastName=validated_data['lastName'],
            email=validated_data['email'],
            password=validated_data['password'],
            phoneNumber=validated_data['phoneNumber'],
            dateOfBirth=validated_data['dateOfBirth'],
            panNumber=validated_data['panNumber'],
            addressID=validated_data['addressID'],
            adminID=validated_data.get('adminID'),
            customerID=validated_data.get('customerID')
        )
        return user

# Transactions Serializer
class TransactionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transactions
        fields = '__all__'