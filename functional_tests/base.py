from datetime import datetime
from django.contrib.staticfiles.testing import StaticLiveServerTestCase
import os
from time import sleep

from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.firefox.options import Options


class FunctionalTest(StaticLiveServerTestCase):
    host = 'web'

    def setUp(self):
        options = Options()
        options.headless = True
        self.browser = webdriver.Remote(
            'http://selenium:4444/wd/hub', desired_capabilities=DesiredCapabilities.FIREFOX)
        self.browser.get(self.live_server_url)
        self.actions = ActionChains(self.browser)
        self.sleep = sleep

    def tearDown(self):
        if self._test_has_failed():
            for i, handle in enumerate(self.browser.window_handles):
                self.browser.switch_to.window(handle)
                filepath = self._create_error_capture_filepath(i)
                timestamp = datetime.now()
                self.browser.save_screenshot(
                    f'{filepath}/screenshot-{timestamp}.png')
                self.capture_html(filepath, timestamp)
        self.browser.quit()

    def _test_has_failed(self):
        # returns True if any errors were raised during test run
        return any(error for (method, error) in self._outcome.errors)

    def _create_error_capture_filepath(self, handle_index):
        timestamp = datetime.now()
        classname = self.__class__.__name__
        method = self._testMethodName
        dir_path = f'functional_tests/error_capture/{timestamp}-{classname}.{method}/{handle_index}'
        os.makedirs(dir_path)
        return dir_path

    def capture_html(self, filepath, timestamp):
        filename = f'{filepath}/source-{timestamp}.html'
        with open(filename, 'w') as f:
            f.write(self.browser.page_source)

    def execute_js_file(self, filepath):
        self.browser.execute_script(open(filepath).read())

    def simulate_drag_drop(self, source_selector, target_selector):
        source = self.browser.find_element_by_css_selector(source_selector)
        target = self.browser.find_element_by_css_selector(target_selector)
        jquery_url = "https://code.jquery.com/jquery-3.6.0.min.js"
        with open('functional_tests/sim-scripts/jquery_load_helper.js') as f:
            load_jquery_js = f.read()
        with open('functional_tests/sim-scripts/drag_and_drop_helper.js') as f:
            drag_and_drop_js = f.read()
        self.browser.execute_async_script(load_jquery_js, jquery_url)
        self.browser.execute_script(drag_and_drop_js + 
            f"$('{source_selector}').simulateDragDrop({{ dropTarget: '{target_selector}' }});")
        return source, target