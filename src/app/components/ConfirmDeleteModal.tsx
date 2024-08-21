interface ConfirmModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
  }
  

export const ConfirmDeleteModal: React.FC<ConfirmModalProps> = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;
  
    return (
        <div className="w-full h-full fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <div className="fixed inset-0 bg-black bg-opacity-30"></div>
          <div className="relative bg-white rounded-2xl py-4 px-5 shadow-lg max-w-lg mx-auto">
            <div className="overflow-y-auto py-4 w-[400px]">
              <p className="text-gray-600 text-[18px] font-bold">您是否確定刪除此收藏項目?</p>
            </div>
            <div className="flex items-center justify-end pt-4 space-x-4">
              <button onClick={onCancel} className="py-2.5 px-5 text-xs bg-[#f0ffff] text-black rounded-full shadow-xs transition-all duration-500 hover:bg-[#afeeee]">取消</button>
              <button onClick={onConfirm} className="py-2.5 px-5 text-xs bg-[#19a8e6] text-white rounded-full shadow-xs transition-all duration-500 hover:bg-[#2D759E]">確定</button>
            </div>
          </div>
        </div>
      </div>
    );
  };