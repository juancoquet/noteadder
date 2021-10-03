from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.test import TestCase
from unittest.mock import patch

from contact.models import Feedback, Contact


@patch('contact.models.Feedback.send_notification')
class FeedbackModelTest(TestCase):

    def test_valid_feedback(self, mock_notification):
        Feedback.objects.create(
            subject='Test feedback',
            message='my feedback message',
            email='test@email.com'
        )
        self.assertEqual(len(Feedback.objects.all()), 1)

    def test_subject_not_required(self, mock_notification):
        Feedback.objects.create(
            subject=None,
            message='my feedback message',
            email='test@email.com'
        )
        self.assertEqual(len(Feedback.objects.all()), 1)

    def test_email_not_required(self, mock_notification):
        Feedback.objects.create(
            subject='Test feedback',
            message='my feedback message',
            email=None
        )
        self.assertEqual(len(Feedback.objects.all()), 1)

    def test_message_required(self, mock_notification):
        with self.assertRaises(IntegrityError):
            Feedback.objects.create(
                subject='Test feedback',
                message=None,
                email='test@email.com'
            )

    def test_object_creation_sends_email(self, mock_notification):
        Feedback.objects.create(
            subject='Test feedback',
            message='my feedback message',
            email='test@email.com',
        )
        self.assertTrue(mock_notification.called)


@patch('contact.models.Contact.send_notification')
class ContactModelTest(TestCase):

    def test_valid_contact(self, mock_notification):
        Contact.objects.create(
            subject='Test contact',
            message='my contact message',
            email='test@email.com'
        )
        self.assertEqual(len(Contact.objects.all()), 1)

    def test_subject_not_required(self, mock_notification):
        Contact.objects.create(
            subject=None,
            message='my contact message',
            email='test@email.com'
        )
        self.assertEqual(len(Contact.objects.all()), 1)

    def test_email_required(self, mock_notification):
        with self.assertRaises(IntegrityError):
            Contact.objects.create(
                subject='Test contact',
                message='my contact message',
                email=None
            )

    def test_message_required(self, mock_notification):
        with self.assertRaises(IntegrityError):
            Contact.objects.create(
                subject='Test contact',
                message=None,
                email='test@email.com'
            )

    def test_object_creation_sends_email(self, mock_notification):
        Contact.objects.create(
            subject='Test contact',
            message='my contact message',
            email='test@email.com',
        )
        self.assertTrue(mock_notification.called)
