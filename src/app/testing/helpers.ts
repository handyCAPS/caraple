import { MockedComponentFixture, MockedDebugElement, ngMocks } from 'ng-mocks';

export function getText<T>(element: MockedDebugElement<T>): string {
  return element.nativeElement.textContent.trim();
}

export function getTestId<T>(
  fixture: MockedComponentFixture<T, T>,
  testId: string
): MockedDebugElement<T> | MockedDebugElement<T>[] {
  return ngMocks.find(fixture, `[data-testid="${testId}"]`);
}

export function getAllTestId<T>(
  fixture: MockedComponentFixture<T, T>,
  testId: string
): MockedDebugElement<T>[] {
  return ngMocks.findAll(fixture, `[data-testid="${testId}"]`);
}

export function testId(id: string): string {
  return `[data-testid="${id}"]`;
}
