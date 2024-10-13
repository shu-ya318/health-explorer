import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import HomePage from "../src/app/page"; //  勿單寫src或app路徑
import { useRouter } from "next/navigation";
import Image from "next/image";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  push: jest.fn(),
}));

const mockPush = jest.fn();
beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
    route: "/",
    pathname: "/",
    query: {},
    asPath: "",
  });
});

type ImageProps = {
  src: string;
  alt: string;
  onLoad?: () => void;
};

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, onLoad }: ImageProps) => (
    <Image src={src} alt={alt} onLoad={onLoad} />
  ),
}));

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
  getAuth: jest.fn(() => ({ currentUser: null })),
  getFirestore: jest.fn(),
  getStorage: jest.fn(),
}));

// 模擬Firebase，以免調用真實firebase API遇到驗證失敗
jest.mock("../src/app/api/initInstitutionData", () => ({
  initInstitutionData: jest.fn(() => Promise.resolve()),
}));

describe("HomePage Component", () => {
  it("renders loading state initially", () => {
    render(<HomePage />);
    const loader = screen.getByTestId("loader");
    expect(loader).toBeInTheDocument();
  });

  it("hides loading spinner after loading", async () => {
    render(<HomePage />);
    await waitFor(() =>
      expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument()
    );
  });
});
