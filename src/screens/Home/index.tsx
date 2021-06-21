import React, { useState, useCallback, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { SearchBar } from '../../components/SearchBar';
import { LoginDataItem } from '../../components/LoginDataItem';

import { useStorageData } from '../../hooks/useStorageData';

import {
  Container,
  LoginList,
  EmptyListContainer,
  EmptyListMessage,
  ActivityIndicatorWraper,
} from './styles';

interface LoginDataProps {
  id: string;
  title: string;
  email: string;
  password: string;
};

type LoginListDataProps = LoginDataProps[];

export function Home() {
  const { getLoginFromAsyncStorage } = useStorageData();

  const [isLoading, setIsLoading] = useState(true);
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
  const [data, setData] = useState<LoginListDataProps>([]);

  async function loadData() {
    const content = await getLoginFromAsyncStorage();
    setSearchListData(content);
    setData(content);

    setIsLoading(false);
  }
  
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  async function handleFilterLoginData(search: string) {
    if (search !== '') {
      const filteredPasswords = data.filter(password => password.title === search);
      setSearchListData(filteredPasswords);
    } else {
      setSearchListData(data);
    }
  }

  return (
    <Container>
      <SearchBar
        placeholder="Pesquise pelo nome do serviço"
        onChangeText={(value) => handleFilterLoginData(value)}
      />

      {
        isLoading ? (
          <ActivityIndicatorWraper>
            <ActivityIndicator color="#9883BF" size="large" />
          </ActivityIndicatorWraper>
        ) : (
          <LoginList
            keyExtractor={(item) => item.id}
            data={searchListData}
            ListEmptyComponent={(
              <EmptyListContainer>
                <EmptyListMessage>Nenhum item a ser mostrado</EmptyListMessage>
              </EmptyListContainer>
            )}
            renderItem={({ item: loginData }) => {
              return <LoginDataItem
                title={loginData.title}
                email={loginData.email}
                password={loginData.password}
              />
            }}
          />
        )
      }

    </Container>
  )
}