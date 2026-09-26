from django.db import models

class Product(models.Model):
    CATEGORY_CHOICES = [
        ("Fan", "Fan"),
        ("Mobile", "Mobile"),
        ("Laptop", "Laptop"),
        ("TV", "TV"),
        ("Other", "Other"),
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default="Other"
    )
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()

    def __str__(self):
        return self.name