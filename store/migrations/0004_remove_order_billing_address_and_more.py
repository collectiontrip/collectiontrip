# Generated by Django 5.1.3 on 2025-01-01 17:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0003_address_country_address_is_billing_address_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='billing_address',
        ),
        migrations.RemoveField(
            model_name='order',
            name='shipping_address',
        ),
    ]
