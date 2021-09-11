from .base import FunctionalTest


class NoteTest(FunctionalTest):

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
        self.assertEqual(dropped_note, qtr_note)

        # now that they have dropped a note into the bar, there is less space available for other notes
        self.assertEqual(bar.get_attribute('value'), '3')

        # They add three more quarter notes into the bar to fill it up. After doing so, none of the note blocks
        # outside the bar are draggable anymore.
        for _ in range(3):
            qtr_note, bar = self.simulate_drag_drop('.note-block.quarter-note:not(.rest)', '.bar-container')
        
        self.assertEqual(bar.get_attribute('value'), '0')

        note_blocks = self.browser.find_elements_by_css_selector('.note-block:not(.placed)')
        for block in note_blocks:
            self.assertEqual(block.get_attribute('draggable'), 'false')

    
    def test_drag_note_into_bin(self):
        # The user drags a note into the bar
        qtr_note, bar = self.simulate_drag_drop('.note-block.quarter-note:not(.rest)', '.bar-container')
        self.assertEqual(bar.get_attribute('value'), '3')
        
        # They realise they made a mistake, so they drag the note they jsut placed to the bin
        placed_note, bin = self.simulate_drag_drop('.note-block.quarter-note.placed', '.bin')

        # The note disappears and they once again have a full bar to work with
        placed = bar.find_elements_by_css_selector('.note-block')
        self.assertEqual(len(placed), 0)
        self.assertEqual(bar.get_attribute('value'), '4')


    def test_note_values_affect_bar_value(self):
        # The user drags each block into the bar and then into the bin one at a time.
        # They see that the available space in the bar is appropriately updated each time.
        note_blocks = self.browser.find_elements_by_css_selector('.note-block')
        for note in note_blocks:
            classes = note.get_attribute('class')
            selector = ('.' + classes).replace(' ', '.')
            if 'rest' not in classes:
                selector += ':not(.rest)'
            _, bar = self.simulate_drag_drop(selector, '.bar-container')
            note_value = float(note.get_attribute('value'))
            expected_val = str(4 - note_value).replace('.0', '')
            self.assertEqual(bar.get_attribute('value'), expected_val)
            selector += '.placed'
            self.simulate_drag_drop(selector, '.bin')
            self.assertEqual(bar.get_attribute('value'), '4')


    def test_dotted_note_values(self):
        note_blocks = self.browser.find_elements_by_css_selector('.note-block')
        original_values = [float(note.get_attribute('value')) for note in note_blocks]
        
        # The user sees an option to change the notes into dotted notes and clicks it.
        dot_toggle = self.browser.find_element_by_css_selector('.dot-toggle')
        dot_toggle.click()

        # The note values change
        note_blocks = self.browser.find_elements_by_css_selector('.note-block')
        for original_val, note in zip(original_values, note_blocks):
            expected_value = str(original_val * 1.5).replace('.0', '')
            self.assertEqual(note.get_attribute('value'), expected_value)

        # They drag one of each note into the bar
        _, bar = self.simulate_drag_drop('.note-block:not(.rest)', '.bar-container')
        
        # They uncheck the dotted note toggle. The placed notes remain as dotted values, while the unplaced
        # notes change back
        dot_toggle.click()
        placed_notes = bar.find_elements_by_css_selector('.note-block')
        note_blocks = self.browser.find_elements_by_css_selector('.note-block:not(.rest):not(.placed)')
        original_values = [float(note.get_attribute('value')) for note in note_blocks]
        for original_value, note in zip(original_values, placed_notes):
            expected_value = str(original_value * 1.5).replace('.0', '')
            self.assertEqual(note.get_attribute('value'), expected_value)

        # They bin all the notes and drag in one of each regular-value note
        self.simulate_drag_drop('.placed', '.bin')
        _, bar = self.simulate_drag_drop('.note-block:not(.rest)', '.bar-container')

        # They click the dotted note toggle again. This time the placed notes remain as their original value,
        # but the unplaced notes become dotted values.
        dot_toggle.click()
        placed_notes = bar.find_elements_by_css_selector('.note-block')
        note_blocks = self.browser.find_elements_by_css_selector('.note-block:not(.rest):not(.placed)')
        note_values = [float(note.get_attribute('value')) for note in note_blocks]
        for note_value, note in zip(note_values, placed_notes):
            self.assertEqual(float(note.get_attribute('value')) * 1.5, note_value)


    def test_placed_notes_can_be_reordered(self):
        # The user drags one of each note into the bar
        note_blocks = self.browser.find_elements_by_css_selector('.note-block:not(.rest)')
        for note in note_blocks:
            classes = note.get_attribute('class')
            selector = ('.' + classes).replace(' ', '.') + ':not(.rest)'
            _, bar = self.simulate_drag_drop(selector, '.bar-container')
        original_order = bar.find_elements_by_css_selector('.note-block')

        # They drag the quarter note on the left to the right and the notes are rearranged
        self.simulate_drag_drop('.placed:nth-child(1)', '.bar-container')
        new_order = bar.find_elements_by_css_selector('.note-block')

        self.assertNotEqual(original_order, new_order)


class NotationTest(FunctionalTest):

    def test_dragging_notes_updates_stave(self):
        # The user drags one of each note into the bar. Upon each addition, the stave is updated
        # with a new note to match the drag-drop bar.
        note_blocks = self.browser.find_elements_by_css_selector('.note-block')
        for note in note_blocks:
            classes = note.get_attribute('class')
            selector = ('.' + classes).replace(' ', '.')
            if 'rest' not in classes:
                selector += ':not(.rest)'
            _, bar = self.simulate_drag_drop(selector, '.bar-container')
            stave_notes = self.browser.find_elements_by_css_selector('.vf-note')
            self.assertEqual(len(stave_notes), len(bar.find_elements_by_css_selector('.note-block')))

        # They drag each placed note into the bin, and the stave updates in real time
        placed_notes = bar.find_elements_by_css_selector('.note-block')
        for note in placed_notes:
            classes = note.get_attribute('class')
            selector = ('.' + classes).replace(' ', '.')
            if 'rest' not in classes:
                selector += ':not(.rest)'
            self.simulate_drag_drop(selector, '.bin')
            stave_notes = self.browser.find_elements_by_css_selector('.vf-note')
            self.assertEqual(len(stave_notes), len(bar.find_elements_by_css_selector('.note-block')))


class TimeSignatureTest(FunctionalTest):

    def test_selecting_time_sig_changes_bar_value(self):
        # The user sees that there a buttons to select different time signatures
        time_sigs = self.browser.find_elements_by_css_selector('.time-signature')
        bar = self.browser.find_element_by_css_selector('.bar-container')

        # When they click each time signature, the value of the bar changes
        for sig in time_sigs:
            sig.click()
            bar_val = bar.get_attribute('absolute-value')
            expected_val = int(sig.get_attribute('top')) * float(sig.get_attribute('bottom-value'))
            expected_val = str(expected_val).replace('.0', '')
            self.assertEqual(bar_val, expected_val)

    def test_selecting_time_sig_clears_bar(self):
        # The user drags some notes into the bar
        _, bar = self.simulate_drag_drop('.note-block:not(.placed)', '.bar-container')
        self.assertGreater(len(bar.find_elements_by_css_selector('.placed')), 0)

        # They click a time signature button, and the bar is cleared
        self.browser.find_element_by_css_selector('.time-signature').click()
        self.assertEqual(len(bar.find_elements_by_css_selector('.placed')), 0)


class PlaybackTest(FunctionalTest):

    def test_play_button_only_enables_when_bar_full(self):
        # The user sees that the play button is not clickable
        play = self.browser.find_element_by_css_selector('.play')
        self.assertEqual(play.value_of_css_property('pointer-events'), 'none')

        # They fill up the bar and the play button becomes clickable
        for _ in range(4):
            self.simulate_drag_drop('.note-block.quarter-note:not(.rest):not(.placed)', '.bar-container')
        play = self.browser.find_element_by_css_selector('.play')
        self.assertEqual(play.value_of_css_property('pointer-events'), 'all')

        # They remove a note and the button becomes disabled again
        self.simulate_drag_drop('.placed:nth-child(4)', '.bin')
        self.assertEqual(play.value_of_css_property('pointer-events'), 'none')

    def test_play_displays_markers(self):
        # The user fills up the bar
        for _ in range(4):
            self.simulate_drag_drop('.note-block.quarter-note:not(.rest):not(.placed)', '.bar-container')

        # They don't see any markers on the page
        markers = self.browser.find_elements_by_css_selector('.playback-marker')
        for m in markers:
            self.assertEquals(m.value_of_css_property('opacity'), '0')
        
        # They click the play button, and the markers are shown
        self.browser.find_element_by_css_selector('.play').click()
        for m in markers:
            self.assertGreater(float(m.value_of_css_property('opacity')), 0)
        
        # The markers disappear when playback is done
        self.sleep(4)
        for m in markers:
            self.assertEqual(m.value_of_css_property('opacity'), '0')

    def test_changing_time_sig_disables_play_button(self):
        # The user fills up the bar
        for _ in range(4):
            self.simulate_drag_drop('.note-block.quarter-note:not(.rest):not(.placed)', '.bar-container')
        
        # The play button is now enabled
        play = self.browser.find_element_by_css_selector('.play')
        self.assertEqual(play.value_of_css_property('pointer-events'), 'all')

        # They change the time signature, and the play button becomes diabled once again
        self.browser.find_element_by_css_selector('.time-signature').click()
        self.assertEqual(play.value_of_css_property('pointer-events'), 'none')

    def test_cant_change_time_sig_during_playback(self):
        # The user fills up the bar
        for _ in range(4):
            self.simulate_drag_drop('.note-block.quarter-note:not(.rest):not(.placed)', '.bar-container')
        
        # They click play, and the time signature buttons are disabled
        play = self.browser.find_element_by_css_selector('.play')
        play.click()
        time_sigs = self.browser.find_elements_by_css_selector('.time-signature')
        for sig in time_sigs:
            self.assertTrue('disabled' in sig.get_attribute('class'))
            self.assertEqual(sig.value_of_css_property('pointer-events'), 'none')
        
        # After playback finishes, the timesignatures become clickable once again.
        self.sleep(4)
        for sig in time_sigs:
            self.assertTrue('disabled' not in sig.get_attribute('class'))
            self.assertEqual(sig.value_of_css_property('pointer-events'), 'auto')
