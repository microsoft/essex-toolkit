import { useThematic } from '@thematic/react'
import { useMemo } from 'react'

export function useBarTextForegroundColor(): string {
	const theme = useThematic()
	return useMemo(() => theme.text().fill().hex(), [theme])
}
