import React, {
  useContext,
  ReactNode,
  createContext,
  ReactElement,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IStorageDataProviderProps {
  children: ReactNode;
}

interface ILoginDataProps {
  id: string;
  title: string;
  email: string;
  password: string;
};

interface IStorageDataContextData {
  getLoginFromAsyncStorage: () => Promise<ILoginDataProps[]>;
  setLogin: (newLoginData: ILoginDataProps) => Promise<void>;
}

export const StorageDataContext = createContext({} as IStorageDataContextData);

const StorageDataProvider = ({ children }: IStorageDataProviderProps): ReactElement => {
  const storageKey = '@passmanager:logins';

  const getLoginFromAsyncStorage = async (): Promise<ILoginDataProps[]> => {
    const content = await AsyncStorage.getItem(storageKey);
    const formattedContent = content ? JSON.parse(content) : [];

    return formattedContent;
  };

  const setLogin = async (newLoginData: ILoginDataProps): Promise<void> => {
    const storagedContent = await AsyncStorage.getItem(storageKey);

    const formattedNewLoginData = storagedContent ? JSON.parse(storagedContent) : [];

    const formattedContent = [...formattedNewLoginData, newLoginData];

    await AsyncStorage.setItem(storageKey, JSON.stringify(formattedContent));
  };

  return (
    <StorageDataContext.Provider
      value={{
        getLoginFromAsyncStorage,
        setLogin,
      }}
    >
      {children}
    </StorageDataContext.Provider>
  );
};

const useStorageData = (): IStorageDataContextData => {
  const context = useContext(StorageDataContext);

  return context;
};

export { StorageDataProvider, useStorageData };
