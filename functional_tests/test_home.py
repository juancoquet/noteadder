from .base import FunctionalTest


class NoteDragTest(FunctionalTest):

    def test_can_drag_note_into_bar(self):
        # A new visitor lands on the hompage and sees several note blocks on the page.
        qtr_note = self.browser.find_element_by_css_selector('.note-block.quarter-note:not(.rest)')
        qtr_note_rest = self.browser.find_element_by_css_selector('.note-block.quarter-note.rest')
        eighth_note = self.browser.find_element_by_css_selector('.note-block.eighth-note:not(.rest)')
        eighth_note_rest = self.browser.find_element_by_css_selector('.note-block.eighth-note.rest')
        sixteenth_note = self.browser.find_element_by_css_selector('.note-block.sixteenth-note:not(.rest)')
        sixteenth_note_rest = self.browser.find_element_by_css_selector('.note-block.sixteenth-note.rest')
        bin_block = self.browser.find_element_by_css_selector('.bin')

        # They also see an empty bar where the can drag the note blocks into.
        bar = self.browser.find_element_by_css_selector('.bar-container')

        # They try to drag a note into the bar.
        # self.actions.drag_and_drop_by_offset(qtr_note, 50, 200).perform()
        self.actions.click_and_hold(qtr_note_rest).pause(2).move_to_element(bar).pause(1).release(bar).perform()
        # self.actions.move_to_element(bar).perform()

        # When they drop the note, it remains inside the bar.
        dropped_note = bar.find_element_by_css_selector('.note-block')
        self.assertEqual(dropped_note, qtr_note)

        # TODO: figure out why drag and drop isn't working