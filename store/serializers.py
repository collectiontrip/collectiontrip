from decimal import Decimal
from django.db import transaction
from rest_framework import serializers
from .models import Product, Collection, Cart, Review, CartItem, Customer, Order, OrderItem, ProductImage, Address
from .signals import order_created



        
class CollectionSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Collection
        fields = ['id', 'title', 'products_count']
        
    products_count = serializers.IntegerField(read_only=True)
    
        
class ProductImageSerializer(serializers.ModelSerializer):
    
    def create(self, validated_data):
        product_id = self.context['product_id']
        return  ProductImage.objects.create(product_id=product_id, **validated_data)
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image']   
 
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'date', 'name', 'description']
        
    def create(self, validated_data):
        product_id = self.context.get('product_id')
        if not product_id:
            raise serializers.ValidationError("Product ID is required to create a review.")
        return Review.objects.create(product_id=product_id, **validated_data)
           

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    price_with_tax = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'title', 'description', 'slug', 'inventory', 'price', 'price_with_tax', 'collection', 'images', 'reviews']
    
    price_with_tax = serializers.SerializerMethodField( method_name='calculate_tax')
    
    
    
    
    def calculate_tax(self, product: Product):
        if not product.price:
            return Decimal(0)
        return product.price * Decimal( 1.1)
    
    def create(self, validated_data):
        product = Product(**validated_data)
        product.other = 1
        product.save()
        return product
    


        
    
    
    

    
class SimpleProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'title', 'price', ]    
    

class  CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    total_price = serializers.SerializerMethodField()
    
    def get_total_price(self, cart_item:CartItem):
            return cart_item.quantity * cart_item.product.price
         
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'total_price']
        
        
    
class CartSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()
    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_price']
        
    def get_total_price(self, cart:Cart):
        return sum([item.quantity * item.product.price for item in cart.items.all()])
    
    
class AddCartItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField()
    
    def validate_product_id(self, value):
        if not Product.objects.filter(pk=value).exists():
            raise serializers.ValidationError('No product with the given id was found')
        return value   
    
    def save(self, **kwargs):
        cart_id = self.context['cart_id']
        product_id = self.validated_data['product_id']
        quantity = self.validated_data['product_id']
        
        try:
            cart_item = CartItem.objects.get(cart_id=cart_id, product_id=product_id)
            cart_item.quantity += quantity
            cart_item.save()
            self.instance = cart_item
        except CartItem.DoesNotExist:
            self.instance = CartItem.objects.create(cart_id=cart_id, **self.validated_data)
    
        return self.instance
        
    class Meta:
        model = CartItem
        fields = ['id', 'product_id', 'quantity']
        
class UpdateCartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = [ 'quantity']
        
    
    
class CustomerSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Customer
        fields = ['id', 'user_id', 'phone', 'birth_date', 'membership', 'image']
        



class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            'id',
            'street',
            'city',
            'state',
            'postal_code',
            'country',
            'is_billing_address',
            'is_shipping_address',
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    product = serializers.StringRelatedField()  # Assuming product has a string representation

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'unit_price', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    shipping_address = AddressSerializer(read_only=True)
    billing_address = AddressSerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'customer',
            'placed_at',
            'payment_status',
            'items',
            'shipping_address',
            'billing_address',
        ]


class CreateOrderSerializer(serializers.Serializer):
    cart_id = serializers.UUIDField()
    shipping_address = serializers.PrimaryKeyRelatedField(queryset=Address.objects.all(), required=False)
    billing_address = serializers.PrimaryKeyRelatedField(queryset=Address.objects.all(), required=False)

    def validate_cart_id(self, cart_id):
        try:
            cart = Cart.objects.get(pk=cart_id)
        except Cart.DoesNotExist:
            raise serializers.ValidationError('No cart with the given ID was found.')

        if not CartItem.objects.filter(cart=cart).exists():
            raise serializers.ValidationError('The cart is empty.')

        return cart_id

    def validate(self, data):
        shipping_address = data.get('shipping_address')
        billing_address = data.get('billing_address')
        customer = self.context['user'].customer

        if not shipping_address and not billing_address:
            raise serializers.ValidationError(
                "At least one address (shipping or billing) must be provided."
            )

        if shipping_address and billing_address and shipping_address == billing_address:
            raise serializers.ValidationError(
                "Shipping and billing addresses cannot be the same."
            )

        for address, address_type in [(shipping_address, "Shipping"), (billing_address, "Billing")]:
            if address and address.customer != customer:
                raise serializers.ValidationError(
                    f"{address_type} address must belong to the same customer."
                )

        return data

    def save(self, **kwargs):
        cart_id = self.validated_data['cart_id']
        customer = self.context['user'].customer

        order = Order.objects.create(
            customer=customer,
            shipping_address=self.validated_data.get('shipping_address'),
            billing_address=self.validated_data.get('billing_address'),
        )

        cart_items = CartItem.objects.filter(cart_id=cart_id)
        order_items = [
            OrderItem(
                order=order,
                product=item.product,
                unit_price=item.product.price,
                quantity=item.quantity,
            )
            for item in cart_items
        ]
        OrderItem.objects.bulk_create(order_items)

        order_created.send_robust(sender=self.__class__, order=order)

        Cart.objects.filter(pk=cart_id).delete()

        return order
class UpdateOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status', 'shipping_address', 'payment_status']