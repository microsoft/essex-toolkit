/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useThematic } from '@thematic/react'

/**
 * This component simply injects a style block to override a bunch of LineUp styles with Thematic config.
 * Since LineUp is a data table, this uses data elements to construct the table wherever possible rather than application elements.
 * This seems to cover all of the main table styles, and has been tested with light and dark themes.
 * However, this method of overriding built-in styles from a closed component is brittle.
 * TODO: thematic should define a data table base type with borders, etc., derived from the data marks,
 * which would make it much more clear to apply consistently. This is also somewhat different than a standard
 * table, because it has embedded visualization such as bar charts, so the plot area config is used
 * rather than main application elements.
 */
export const ThematicLineupStyles = (): JSX.Element => {
	const theme = useThematic()
	const borderColor = theme.plotArea().stroke().hex()
	const border = `${theme.plotArea().strokeWidth()}px solid ${borderColor}`
	const background = theme.plotArea().fill().hex()
	const text = theme.text().fill().hex()
	const headerText = theme.axisTickLabels().fill().hex()
	const hover = theme.gridLines().stroke().hex()
	const tooltip = theme.tooltip().fill().hex()
	const accent = theme.application().accent()
	const rule = theme.rule().stroke().hex()
	return (
		<style>
			{`
        /** main grid */
        .lineup-engine {
            border: ${border};
            background: ${background}
						color: ${text};
						font-size: 0.8em;
        }
        
        /** header row/cells */
        .lineup-engine > header > article {
		    		background: none;
        }
        section.lu-header {
            background: none;
            border-color: ${borderColor};
            color: ${headerText};
        }
        section.lu-header > .lu-handle {
            background: none;
            border-color: ${borderColor};
        }
        .lu span[data-type-cat]::before, .lu [data-type-cat] .lu-label::before {
						/* hide the data type icon to reduce clutter */
            display: none;
        }
        section.lu-header > .lu-toolbar {
		    		color: ${headerText};
        }
        section.lu-header:hover {
            background: ${hover};
        }
        
        /** header popup options */
        .lu-dialog, .lu-tooltip {
            color: ${text};
            background: ${tooltip};
        }
        .lu-more-options > i:hover {
            background: ${background};
        }
        .lu-action[title^='Filter'][data-active]::before {
            color: ${accent};
        }
        .lu-toolbar > i[title^='Group'][data-priority]::after, .lu-toolbar > i[title^='Sort'][data-priority]::after {
        		color: ${accent};
        }
        .lu-action[title='Sort'][data-sort$='sc']::before, .lu-action[title='Sort Group'][data-sort$='sc']::before, .lu-action[title^='Group'][data-group='true']::before {
            color: ${accent};
        }

        /** individual grid rows */
        article.lu-row-body {
            border-top: ${border};
        }
        div.lu-row {
            border-bottom: ${border};
        }
        .lineup-engine > main > article > div {
	        background: none;
        }
        .lineup-engine > main:not(.scrolling) > article > div:hover, .lineup-engine > main:not(.scrolling) > article > div.le-highlighted {
            box-shadow: 2px 0 0 0 ${rule}, 0 2px 0 0 ${rule}, 2px 2px 0 0 ${rule}, 2px 0 0 0 ${rule} inset, 0 2px 0 0 ${rule} inset;
        }
        .lu-row.lu-selected {
            box-shadow: 2px 0 0 0 ${rule}, 0 2px 0 0 ${rule}, 2px 2px 0 0 ${rule}, 2px 0 0 0 ${rule} inset, 0 2px 0 0 ${rule} inset;
        }
        `}
		</style>
	)
}
