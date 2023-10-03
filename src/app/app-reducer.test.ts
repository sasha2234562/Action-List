import { appReducer, setAppErrorAC, setAppStatusAC } from './app-reducer'

let startState: { status: string; error: string; isInitialized: boolean; } | undefined;

beforeEach(() => {
	startState = {
		error: '',
		status: 'idle',
		isInitialized: false
	}
})

test('correct error message should be set', () => {
	const endState = appReducer(startState, setAppErrorAC({error:'some error'}))
	expect(endState.error).toBe('some error');
})

test('correct status should be set', () => {
	const endState = appReducer(startState, setAppStatusAC({status:'loading'}))
	expect(endState.status).toBe('loading');
})

