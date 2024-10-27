import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

process.env.NEXT_PUBLIC_BACKEND_URL = 'http://localhost:3000';
process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-api-key';
