/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { addDecorator } from '@storybook/react'
import { configure } from '@essex/storybook-config/lib/preview'
import { ThematicFluentDecorator } from './ThematicFluentDecorator'

addDecorator(ThematicFluentDecorator)
configure()
