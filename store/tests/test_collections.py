from store.models import Collection
from django.contrib.auth import get_user_model
import pytest
from rest_framework import status
from model_bakery import baker

User = get_user_model()

@pytest.fixture
def create_collection(api_client):
    def do_create_collection(collection):
        return api_client.post('/store/collections/', collection)
    return do_create_collection 

@pytest.fixture
def authenticate(api_client, db):
    def do_authenticate(is_staff=False):
        user = User.objects.create_user(username='testuser', password='testpass', is_staff=is_staff)
        api_client.force_authenticate(user=user)
    return do_authenticate


@pytest.mark.django_db
class TestCreateCollections:
    def test_if_user_anonymous_returns_401(self, create_collection):
        response = create_collection({'title': 'a'})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_if_user_admin_returns_403(self, authenticate, create_collection):
        authenticate(is_staff=False)  # Regular user, not staff
        response = create_collection({'title': 'a'})
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_if_data_is_invalid_400(self, authenticate, create_collection):
        authenticate(is_staff=True)  # Admin user
        response = create_collection({'title': ''})
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'title' in response.data  # Ensure 'title' is in response data
    
    def test_if_data_is_valid_201(self, authenticate, create_collection):
        authenticate(is_staff=True)  # Admin user
        response = create_collection({'title': 'a'})
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['id'] > 0


@pytest.mark.django_db
class TestRetriveCollection:
    def test_if_collection_exists_returns_200(self, api_client):
        Collection.objects.create(title='a')
        collection = baker.make(Collection)
        response = api_client.get(f'/store/collections/ {collection.id}/')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data == {
            'id': collection.id,
            'title': collection.title, 
            'products_count': 0
        }