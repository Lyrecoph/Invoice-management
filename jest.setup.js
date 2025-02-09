// jest.setup.js
import '@testing-library/jest-dom';

// --- Mock global pour jspdf ---
jest.mock('jspdf', () => {
  // On crée des fonctions mockées pour save, addImage et getWidth
  const save = jest.fn();
  const addImage = jest.fn();
  const getWidth = jest.fn(() => 210);

  // L'instance retournée par le constructeur doit avoir une propriété "internal"
  // avec "pageSize" qui contient la méthode "getWidth"
  const instance = {
    internal: {
      pageSize: {
        getWidth,
      },
    },
    save,
    addImage,
  };

  // On crée un constructeur mocké qui enregistre ses instances
  const jsPDFMock = jest.fn(() => instance);

  return {
    __esModule: true,
    default: jsPDFMock,
  };
});

// --- Mock global pour html2canvas-pro ---
jest.mock("html2canvas-pro", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({
    toDataURL: jest.fn().mockReturnValue("data:image/png;base64,fakeBase64String"),
  }),
}));

// --- Polyfill pour HTMLCanvasElement.getContext ---
HTMLCanvasElement.prototype.getContext = function (type) {
  if (type === '2d') {
    return {
      fillRect: jest.fn(),
      clearRect: jest.fn(),
      getImageData: jest.fn(() => []),
      putImageData: jest.fn(),
      createImageData: jest.fn(() => []),
      setTransform: jest.fn(),
      drawImage: jest.fn(),
      save: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      closePath: jest.fn(),
      stroke: jest.fn(),
      translate: jest.fn(),
      scale: jest.fn(),
      rotate: jest.fn(),
      transform: jest.fn(),
      resetTransform: jest.fn(),
    };
  }
  return null;
};
