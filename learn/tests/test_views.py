from django.test import TestCase


class LearnPageTest(TestCase):

    def test_uses_learn_template(self):
        response = self.client.get('/learn/')
        self.assertTemplateUsed(response, 'learn.html')