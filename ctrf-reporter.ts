import { Reporter, TestCase, TestResult, Suite } from '@playwright/test/reporter';
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

interface CTRFReport {
  version: string;
  metadata: {
    framework: string;
    startTime: string;
    endTime: string;
    totalTests: number;
    passed: number;
    failed: number;
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

    const report: CTRFReport = {
      version: '1.0',
      metadata: {
        framework: 'Playwright',
        startTime: this.startTime.toISOString(),
        endTime: endTime.toISOString(),
        totalTests: this.tests.length,
        passed,
        failed,
      },
      tests: this.tests,
    };

    fs.writeFileSync('ctrf/ctrf-report.json', JSON.stringify(report, null, 2));
    console.log('CTRF report written to ctrf-report.json');
  }
}

export default CTRFReporter;
