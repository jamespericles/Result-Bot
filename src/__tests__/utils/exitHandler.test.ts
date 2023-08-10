import { exitHandler } from 'util/index'

jest.mock('util/exitHandler')

describe('exitHandler', () => {
  it('should call exitHandler when process exits', () => {
    process.on('exit', (code) => exitHandler(code))
    process.emit('exit', 1)

    expect(exitHandler).toHaveBeenCalled()
    expect(exitHandler).toHaveBeenCalledWith(1)
  })
})
