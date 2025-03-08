from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, AccountType, Transactions, TransactionType
from .serializers import (
    UserSerializer, AccountTypeSerializer, TransactionsSerializer, TransactionTypeSerializer
)
from decimal import Decimal
from django.utils.dateparse import parse_date


# from transformers import AutoTokenizer, pipeline, AutoModelForCausalLM
# from .serializers import ChatRequestSerializer, ChatResponseSerializer


# # Load model and tokenizer
# model_name = "NessCodes/nessFYP"
# tokenizer = AutoTokenizer.from_pretrained(model_name)
# model = AutoModelForCausalLM.from_pretrained(model_name, device_map="auto")

# # Initialize pipeline for inference
# chatbot_pipeline = pipeline("text-generation", model=model, tokenizer=tokenizer)

# 1. Create User (Superadmin Only)
class CreateUserView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # No need to manually add balance here; it's already set to 500 in the model.
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 2. Login View
class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        try:
            user = User.objects.get(username=username)
            if user.check_password(password):
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    # 'user': {
                    #     'id': user.id,
                    #     'username': user.username,
                    #     'email': user.email,
                    #     'phone': user.phone,
                    #     'balance': str(user.account_balance)  # Include balance in response
                    # }
                })
            return Response({"message": "Invalid password"}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_400_BAD_REQUEST)

# 3. User Info View (Authenticated Users Only)
class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

# 4. Refresh Token View
class RefreshTokenView(APIView):
    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            refresh = RefreshToken(refresh_token)
            return Response({"access": str(refresh.access_token)})
        except Exception:
            return Response({"error": "Invalid refresh token"}, status=status.HTTP_400_BAD_REQUEST)

# 5. Check Account Balance
class CheckBalanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"balance": str(request.user.account_balance)})

# 6. Deposit Money
class DepositView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        amount = request.data.get("amount")
        if not amount or Decimal(amount) <= 0:
            return Response({"error": "Invalid amount"}, status=status.HTTP_400_BAD_REQUEST)

        # Update user balance
        request.user.account_balance += Decimal(amount)
        request.user.save()

        # Create transaction
        transaction_type = TransactionType.objects.get(name="Deposit")
        Transactions.objects.create(user=request.user, transaction_type=transaction_type, amount=Decimal(amount))
        
        return Response({
            "message": f"Deposited {amount} successfully",
            "new_balance": str(request.user.account_balance)
        })

# 7. Withdraw Money
class WithdrawView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        amount = request.data.get("amount")
        if not amount or Decimal(amount) <= 0:
            return Response({"error": "Invalid amount"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user has sufficient balance
        if request.user.account_balance < Decimal(amount):
            return Response({"error": "Insufficient balance"}, status=status.HTTP_400_BAD_REQUEST)

        # Update user balance
        request.user.account_balance -= Decimal(amount)
        request.user.save()

        # Create transaction
        transaction_type = TransactionType.objects.get(name="Withdrawal")
        Transactions.objects.create(user=request.user, transaction_type=transaction_type, amount=Decimal(amount))
        
        return Response({
            "message": f"Withdrew {amount} successfully",
            "new_balance": str(request.user.account_balance)
        })

# 8. View Account Statement
class AccountStatementView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        transactions = Transactions.objects.filter(user=request.user).order_by("-date")

        # Apply date filtering if both start_date and end_date are provided
        if start_date and end_date:
            start_date = parse_date(start_date)  # Convert string to date
            end_date = parse_date(end_date)

            if start_date and end_date:
                transactions = transactions.filter(date__range=[start_date, end_date])

        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)

# 9. Account Type Management (Admin Only)
class AccountTypeView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        account_types = AccountType.objects.all()
        serializer = AccountTypeSerializer(account_types, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = AccountTypeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        account_type = get_object_or_404(AccountType, pk=pk)
        serializer = AccountTypeSerializer(account_type, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        account_type = get_object_or_404(AccountType, pk=pk)
        account_type.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# 10. Transaction Management (Authenticated Users)
class TransactionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        transactions = Transactions.objects.filter(user=request.user).order_by("-date")
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TransactionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        transaction = get_object_or_404(Transactions, pk=pk, user=request.user)
        transaction.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# 11. Transaction Type Management (Admin Only)
class TransactionTypeView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        transaction_types = TransactionType.objects.all()
        serializer = TransactionTypeSerializer(transaction_types, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TransactionTypeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        transaction_type = get_object_or_404(TransactionType, pk=pk)
        serializer = TransactionTypeSerializer(transaction_type, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        transaction_type = get_object_or_404(TransactionType, pk=pk)
        transaction_type.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# 12. User Management (Admin Only)
class UserView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        user = get_object_or_404(User, pk=pk)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        user = get_object_or_404(User, pk=pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
# class ChatbotView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         serializer = ChatRequestSerializer(data=request.data)

#         if serializer.is_valid():
#             user_message = serializer.validated_data["message"]
#             response = chatbot_pipeline(user_message, max_length=1500, do_sample=True, temperature=0.7)
#             return Response({"response": response[0]["generated_text"]})

#         return Response(serializer.errors, status=400)