import { Reporter, TestCase, TestResult, Suite } from '@playwright/test/reporter';

class CTRFReporter implements Reporter {
  private report: any = {
    version: '1.0', // CTRF version
    tests: [],
  };

  onTestEnd(test: TestCase, result: TestResult) {
    const testReport = {
      id: test.id,
      name: test.title,
      status: result.status,
      duration: result.duration,
      error: result.error ? result.error.message : null,
      stdout: result.stdout,
      stderr: result.stderr,
    };
    this.report.tests.push(testReport);
  }

  async onEnd() {
    const fs = await import('fs');
    fs.writeFileSync('ctrf/ctrf-report.json', JSON.stringify(this.report, null, 2));
    console.log('CTRF report written to ctrf-report.json');
  }
}

export default CTRFReporter;
