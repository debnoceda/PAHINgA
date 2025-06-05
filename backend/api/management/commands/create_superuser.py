from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.db.utils import IntegrityError

class Command(BaseCommand):
    help = 'Creates a superuser'

    def handle(self, *args, **options):
        if not User.objects.filter(username='admin').exists():
            try:
                User.objects.create_superuser(
                    username='admin',
                    email='admin@example.com',
                    password='admin123'  # Change this to a secure password
                )
                self.stdout.write(self.style.SUCCESS('Superuser created successfully'))
            except IntegrityError:
                self.stdout.write(self.style.ERROR('Superuser already exists'))
        else:
            self.stdout.write(self.style.WARNING('Superuser already exists')) 