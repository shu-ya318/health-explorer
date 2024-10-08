interface ConfirmModalProps {
  isOpen: boolean;
  hosp_name: string;
  handleConfirmDelete: (hosp_name: string) => Promise<void>;
  handleCloseModal: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  hosp_name,
  handleConfirmDelete,
  handleCloseModal,
}) => {
  if (!isOpen) return null;

  return (
    <section className="fixed inset-0 z-50 w-full h-full overflow-y-auto">
      <div className="common-row-flex justify-center min-h-screen">
        <div className="fixed inset-0 bg-black bg-opacity-30"></div>
        <section className="relative bg-white rounded-2xl py-4 px-5 shadow-lg max-w-lg mx-auto">
          <div className="overflow-y-auto py-4 xs:w-[400px] w-full">
            <p className="text-gray-600 text-[18px] font-bold">
              您是否確定刪除此項目?
            </p>
          </div>
          <div className="common-row-flex justify-end pt-4 space-x-4">
            <button
              onClick={handleCloseModal}
              type="button"
              className="py-2.5 px-5 text-xs bg-[#F0FFFF] text-black rounded-full shadow-xs transition-all duration-500 hover:bg-[#AFEEEE]"
            >
              取消
            </button>
            <button
              onClick={() => {
                handleConfirmDelete(hosp_name);
              }}
              type="button"
              className="py-2.5 px-5 text-xs bg-[#19A8E6] text-white rounded-full shadow-xs transition-all duration-500 hover:bg-[#2D759E]"
            >
              確定
            </button>
          </div>
        </section>
      </div>
    </section>
  );
};
