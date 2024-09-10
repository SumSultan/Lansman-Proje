import React, { ChangeEvent } from "react";

// Prop interface'ini tanımlayın
interface TitleFormProps {
  title: string;
  onTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

// TitleForm bileşeni
const TitleForm: React.FC<TitleFormProps> = ({ title, onTitleChange }) => {
  return (
    <div className="flex flex-col space-y-6 p-4">
      <div className="flex flex-col">
        <label
          className="block text-[#2B3674] font-[DM Sans] text-[12px] font-normal mb-1"
          style={{ marginLeft: "3%", height: "16px", lineHeight: "15.62px" }}
        >
          Başlık
        </label>
        <input
          type="text"
          value={title}
          onChange={onTitleChange}
          placeholder="  Başlık Alanı"
          className="block border border-[#D0D5DD] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#667085] text-[16px] leading-[24px]"
          style={{ width: "423px", height: "50px", marginLeft: "3%" }}
        />
      </div>
    </div>
  );
};

export default TitleForm;
