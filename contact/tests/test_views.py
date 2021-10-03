from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from django.urls import reverse
from unittest.mock import patch

from contact.forms import FeedbackForm, ContactForm
from contact.models import Contact, Feedback


@override_settings(STATICFILES_STORAGE='django.contrib.staticfiles.storage.StaticFilesStorage')
@patch('contact.models.Feedback.send_notification')
class FeedbackViewTest(TestCase):

    def setUp(self):
        self.response = self.client.get(reverse('feedback'))

    def test_context_contains_feedback_form(self, mock_notification):
        self.assertIsInstance(
            self.response.context['form'],
            FeedbackForm
        )

    def test_post_sends_notificaton(self, mock_notification):
        self.client.post(
            reverse('feedback'),
            data={
                'subject': 'my subject',
                'message': 'my feedback message',
                'email': 'my@email.com'
            }
        )
        self.assertTrue(mock_notification.called)

    def test_post_saves_object_fields(self, mock_notification):
        self.client.post(
            reverse('feedback'),
            data={
                'subject': 'my subject',
                'message': 'my feedback message',
                'email': 'my@email.com'
            }
        )
        feedback = Feedback.objects.first()
        self.assertEqual(feedback.subject, 'my subject')
        self.assertEqual(feedback.message, 'my feedback message')
        self.assertEqual(feedback.email, 'my@email.com')



@override_settings(STATICFILES_STORAGE='django.contrib.staticfiles.storage.StaticFilesStorage')
@patch('contact.models.Contact.send_notification')
class ContactViewTest(TestCase):

    def setUp(self):
        self.response = self.client.get(reverse('contact'))

    def test_context_contains_contact_form(self, mock_notification):
        self.assertIsInstance(
            self.response.context['form'],
            ContactForm
        )

    def test_post_sends_notificaton(self, mock_notification):
        self.client.post(
            reverse('contact'),
            data={
                'subject': 'my subject',
                'message': 'my contact message',
                'email': 'my@email.com'
            }
        )
        self.assertTrue(mock_notification.called)

    def test_post_saves_object_fields(self, mock_notification):
        self.client.post(
            reverse('contact'),
            data={
                'subject': 'my subject',
                'message': 'my contact message',
                'email': 'my@email.com'
            }
        )
        contact = Contact.objects.first()
        self.assertEqual(contact.subject, 'my subject')
        self.assertEqual(contact.message, 'my contact message')
        self.assertEqual(contact.email, 'my@email.com')
