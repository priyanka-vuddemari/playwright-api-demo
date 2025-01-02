import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import fs from 'fs';

interface CTRFTest {
  id: string;
  name: string;
  status: string;
  startTime: string;
  endTime: string;
  duration: number;
  logs: string[];
}

interface CTRFSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  flaky: number;
}

interface CTRFReport {
  version: string;
  metadata: {
    framework: string;
    startTime: string;
    endTime: string;
    summary: CTRFSummary;
  };
  tests: CTRFTest[];
}

class CTRFReporter implements Reporter {
  private tests: CTRFTest[] = [];
  private startTime: Date = new Date();

  onTestEnd(test: TestCase, result: TestResult) {
    const testLog: CTRFTest = {
      id: test.id,
      name: test.title,
      status: result.status,
      startTime: new Date(result.startTime).toISOString(),
      endTime: new Date(new Date(result.startTime).getTime() + result.duration).toISOString(),
      duration: result.duration,
      logs: result.stdout.map((log) => log.toString()),
    };
    this.tests.push(testLog);
  }

  async onEnd() {
    const endTime = new Date();
    const passed = this.tests.filter((test) => test.status === 'passed').length;
    const failed = this.tests.filter((test) => test.status === 'failed').length;
    const skipped = this.tests.filter((test) => test.status === 'skipped').length;
    const flaky = this.tests.filter((test) => test.status === 'flaky').length;

    const report: CTRFReport = {
      version: '1.0',
      metadata: {
        framework: 'Playwright',
        startTime: this.startTime.toISOString(),
        endTime: endTime.toISOString(),
        summary: {
          total: this.tests.length,
          passed,
          failed,
          skipped,
          flaky,
        },
      },
      tests: this.tests,
    };

    fs.writeFileSync('ctrf/ctrf-report.json', JSON.stringify(report, null, 2));
    console.log('CTRF report written to ctrf-report.json');
  }
}

export default CTRFReporter;
