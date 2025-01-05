from django.db.models import Q
from django_filters.rest_framework import FilterSet, CharFilter
from .models import Product

class ProductFilter(FilterSet):
    search = CharFilter(method='filter_search')

    class Meta:
        model = Product
        fields = {
            'collection_id': ['exact'],
            'price': ['gt', 'lt']
        }

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) |
            Q(description__icontains=value) |
            Q(collection__title__icontains=value)
        )
