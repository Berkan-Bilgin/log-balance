"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, AlertCircle, CheckCircle } from "lucide-react";

export const Notifications: React.FC<{ criticalExpenses: string[] }> = ({
  criticalExpenses,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(criticalExpenses.length); // Başlangıç değeri
  const [readNotifications, setReadNotifications] = useState<
    Record<string, boolean>
  >({}); // Okunan bildirimler
  const menuRef = useRef<HTMLDivElement>(null); // Bildirim menüsüne referans

  // Critical expenses değiştiğinde unreadCount'u güncelle
  useEffect(() => {
    setUnreadCount(criticalExpenses.length);
    // Yeni gelen bildirimler için "okunmamış" olarak işaretle
    setReadNotifications((prev) => {
      const updated = { ...prev };
      criticalExpenses.forEach((category) => {
        if (!(category in updated)) {
          updated[category] = false; // Varsayılan olarak okunmamış
        }
      });
      return updated;
    });
  }, [criticalExpenses]);

  const toggleNotifications = () => {
    setIsOpen((prev) => !prev);
  };

  const markAsRead = (category: string) => {
    if (readNotifications[category]) return; // Zaten okunmuşsa işlem yapma

    // Bir bildirimi okundu olarak işaretle ve counter'ı azalt
    setUnreadCount((prev) => Math.max(prev - 1, 0)); // Sayaç 0'ın altına düşmesin
    setReadNotifications((prev) => ({
      ...prev,
      [category]: true, // Bu kategoriyi "okundu" olarak işaretle
    }));
  };

  // Dışarıya tıklamayı veya ESC tuşunu dinle
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false); // Dışarı tıklanınca kapat
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false); // ESC tuşuna basıldığında kapat
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Bildirim İkonu */}
      <button
        onClick={toggleNotifications}
        className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <Bell className="w-6 h-6 text-yellow-500" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Bildirim Menüsü */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10">
          <h2 className="font-bold text-lg text-gray-800 dark:text-gray-200">
            Bildirimler
          </h2>
          {criticalExpenses.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {criticalExpenses.map((category) => (
                <li
                  key={category}
                  className="flex justify-between items-center space-x-2 text-yellow-800 dark:text-yellow-300"
                >
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>
                      {category} kategorisinde harcama limitine yaklaşıldı.
                    </span>
                  </div>
                  <button
                    onClick={() => markAsRead(category)}
                    disabled={readNotifications[category]} // Okunduysa devre dışı bırak
                    className={`p-1 rounded ${
                      readNotifications[category]
                        ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                        : "hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    <CheckCircle
                      className={`w-5 h-5 ${
                        readNotifications[category]
                          ? "text-gray-500"
                          : "text-green-500"
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Henüz bir bildirim yok.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
