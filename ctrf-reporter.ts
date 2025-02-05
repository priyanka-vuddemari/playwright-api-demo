import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import fs from 'fs';

class CTRFReporter implements Reporter {
  private tests: any[] = [];
  private startTime: number = Date.now();

  onTestEnd(test: TestCase, result: TestResult) {
    const duration = result.duration;

    this.tests.push({
      name: test.title,
      status: result.status,
      duration,
    });
  }

  async onEnd() {
    const stopTime = Date.now();
    const passed = this.tests.filter((test) => test.status === 'passed').length;
    const failed = this.tests.filter((test) => test.status === 'failed').length;
    const skipped = this.tests.filter((test) => test.status === 'skipped').length;

    const report = {
      results: {
        tool: {
          name: 'Playwright',
        },
        summary: {
          tests: this.tests.length,
          passed,
          failed,
          pending: 0, // Playwright doesn't have a 'pending' status by default
          skipped,
          other: 0, // Placeholder for undefined statuses
          start: this.startTime,
          stop: stopTime,
        },
        tests: this.tests,
      },
    };

    fs.writeFileSync('summary.json', JSON.stringify(report, null, 2));
    console.log('CTRF report written to ctrf-report.json');
  }
}

export default CTRFReporter;
