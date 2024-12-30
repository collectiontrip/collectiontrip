from django.urls import path
from rest_framework_nested import routers

from . import views




router = routers.DefaultRouter()

router.register('products', views.ProductViewset, basename='products')
router.register('collections', views.CollectionViewSet)
router.register('carts', views.CartViewSet)
router.register('customers', views.CustomerViewSet)
router.register(r'addresses', views.AddressViewSet, basename='address')
router.register(r'orders', views.OrderViewSet, basename='order')
router.register(r'order-items/(?P<order_id>\d+)', views.OrderItemViewSet, basename='order-item')  # Route for order items based on order_id
router.register(r'create-order', views.CreateOrderViewSet, basename='create-order')


products_router = routers.NestedDefaultRouter(router, 'products', lookup='product')
products_router.register('reviews', views.ReviewViewSet, basename='product-reviews')
products_router.register('images', views.ProductImageViewSet, basename='product-images')
carts_routers = routers.NestedDefaultRouter(router, 'carts', lookup='cart')
carts_routers.register('items', views.CartItemViewSet, basename='cart-items')

urlpatterns = router.urls + products_router.urls + carts_routers.urls 


