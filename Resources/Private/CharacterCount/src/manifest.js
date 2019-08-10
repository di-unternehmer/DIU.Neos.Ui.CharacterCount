import manifest from '@neos-project/neos-ui-extensibility';
import CharacterCountContainer from './CharacterCount';

manifest('DIU.Neos.Ui.CharacterCount', {}, globalRegistry => {
    const containerRegistry = globalRegistry.get('containers');
    containerRegistry.set('SecondaryToolbar/Right/CharacterCount', CharacterCountContainer, 'before SecondaryToolbar/Right/KeyboardShortcutButton');
});
