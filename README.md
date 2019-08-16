# DIU.Neos.Ui.CharacterCount

Little package to display a total character count in the main content collection of the current document node.

## Installation

1. Composer require `diu/neos-ui-charactercount`

2. Add the mixin to all nodetypes that you want to have the limit:

```
'Neos.Neos:Document':
  superTypes:
    DIU.Neos.Ui.CharacterCount:CharacterCountLimitMixin: true
```

## Configuration

Adjust the `defaultValue` of `characterCountLimit` to have different defaults per nodetypes.

Adjust `Neos.Neos.Ui.frontendConfiguration.DIU_CharacterCount.textProperties` in order to define which properties should count towards the character count limit (`text` and `title` by default).

## Development

Go to Resources/Private/CharacterCount and do `yarn && yarn build` (or `yarn watch`).
