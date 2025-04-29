"use client";

import React, { useState } from "react";
import Header from "@/app/(components)/Header";
import { Settings, User, Mail, Bell, Globe, Lock, ToggleLeft, ToggleRight } from "lucide-react";

type UserSetting = {
  label: string;
  value: string | boolean;
  type: "text" | "toggle";
  icon: React.ComponentType<{ className?: string }>;
};

const mockSettings: UserSetting[] = [
  { label: "Username", value: "john_doe", type: "text", icon: User },
  { label: "Email", value: "john.doe@example.com", type: "text", icon: Mail },
  { label: "Notifications", value: true, type: "toggle", icon: Bell },
  { label: "Language", value: "English", type: "text", icon: Globe },
  { label: "Two-Factor Auth", value: false, type: "toggle", icon: Lock },
];

const SettingsPage = () => {
  const [userSettings, setUserSettings] = useState<UserSetting[]>(mockSettings);

  const handleSettingChange = (index: number, newValue: string | boolean) => {
    const settingsCopy = [...userSettings];
    settingsCopy[index].value = newValue;
    setUserSettings(settingsCopy);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <Header name="Account Settings" />
        <p className="text-gray-600 mt-2">Manage your account preferences and security settings</p>
      </div>

      <div className="space-y-4">
        {userSettings.map((setting, index) => (
          <div
            key={setting.label}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-blue-100 transition-colors"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <setting.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{setting.label}</h3>
                  {setting.type === 'text' && (
                    <input
                      type="text"
                      value={setting.value as string}
                      onChange={(e) => handleSettingChange(index, e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                </div>
              </div>

              {setting.type === 'toggle' && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleSettingChange(index, !setting.value)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      setting.value ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                      setting.value ? 'translate-x-6' : 'translate-x-2'
                    }`} />
                  </button>
                  <span className={`text-sm ${setting.value ? 'text-green-600' : 'text-gray-500'}`}>
                    {setting.value ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex items-center gap-3 text-gray-600">
          <Settings className="w-5 h-5" />
          <span className="text-sm">Advanced settings coming soon</span>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;