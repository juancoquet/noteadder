from .base import FunctionalTest


class NoteDragTest(FunctionalTest):

    def test_can_drag_note_into_bar(self):
        # A new visitor lands on the hompage and sees several note blocks on the page.
        self.browser.find_element_by_css_selector('.note-block.quarter-note:not(.rest)')
        self.browser.find_element_by_css_selector('.note-block.quarter-note.rest')
        self.browser.find_element_by_css_selector('.note-block.eighth-note:not(.rest)')
        self.browser.find_element_by_css_selector('.note-block.eighth-note.rest')
        self.browser.find_element_by_css_selector('.note-block.sixteenth-note:not(.rest)')
        self.browser.find_element_by_css_selector('.note-block.sixteenth-note.rest')
        self.browser.find_element_by_css_selector('.bin')

        # They also see an empty bar where the can drag the note blocks into.
        self.browser.find_element_by_css_selector('.bar-container')

        # They try to drag a note into the bar.
        qtr_note, bar = self.simulate_drag_drop('.note-block.quarter-note:not(.rest)', '.bar-container')

        # When they drop the note, it remains inside the bar.
        dropped_note = bar.find_element_by_css_selector('.note-block')
        # fails because bar value is updated on drop event
        self.assertEqual(dropped_note, qtr_note)