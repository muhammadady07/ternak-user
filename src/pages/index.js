import { useState, useCallback } from 'react'
import { useUsersList } from '@hooks/users';
import {
  CDataTable,
  CPagination,
  CInput,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CButton
} from '@coreui/react';
import { debounce } from '@helpers/lodash';

const columnTemplate = [
  { key: 'username', label: 'Username'},
  { key: 'name', label: 'Name', filter: false, sorter: false },
  { key: 'email', label: 'Email', filter: false, sorter: false },
  { key: 'gender', label: 'Gender', filter: false, sorter: false },
  { key: 'date', label: 'Registered Date', filter: false, sorter: false },
];

export default function Home() {
  const [params, setParams] = useState({
    page: 1,
    results:10
  });
  const { list, isLoading } = useUsersList(params);

  const debounceSearch = debounce(async (username) => {
    setParams(prevState => ({
      ...prevState,
      keyword: username
    }))
  }, 1500);

  const delayedSearch = useCallback(debounceSearch, []);

  const searchColumn = ({ target: { value } }) => {
    if(value?.length >= 1) {
      delayedSearch(value)
    }else{
      setParams(prevState => {
        const tmpState = {...prevState};
        delete tmpState['keyword'];
        return tmpState;
      });
    }
  }

  const onChangePage = (pageNumber) => {
    if (pageNumber) {
      setParams(prevState => ({
        ...prevState,
        page: pageNumber
      }));
    }
  }

  return (
    <div style={{padding: '20px'}}>
      <CButton
        color="info"
        onClick={() => setParams({
          page: 1,
          results:10
        })}
      >
        Reset Filter
      </CButton>
      <CDataTable
        items={list}
        fields={columnTemplate}
        striped
        pagination
        loading={isLoading}
        sorter
        scopedSlots={
          {
            'date': ({ registered }) => {
              if (registered == null) {
                return <td>{ }</td>;
              } else {
                const date = new Date(registered?.date).toLocaleDateString() + " - " + new Date(registered?.date).toLocaleTimeString();
                return <td>{date}</td>;
              }
            },
            'name': (({ name }) => {
              return <td>{name?.first + " " + name?.last}</td>
            }),
            'username': (({ login }) => {
              return <td>{login?.username}</td>
            }),
          }
        }
        columnFilter
        columnFilterSlot={{
          username: (
            <CInput
              name="username"
              size="sm"
              onChange={searchColumn}
            />
          ),
          gender: (
            <>
              <CDropdown>
                <CDropdownToggle>
                  Filter Gender
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem
                    onClick={() => setParams(prevState => {
                      const tmpParams = { ...prevState }
                      if(tmpParams?.gender) delete tmpParams.gender
                      return tmpParams
                    })}
                  >
                    All
                  </CDropdownItem>
                  <CDropdownItem
                    onClick={() => setParams(prevState => ({
                      ...prevState,
                      gender: 'male'
                    }))}
                  >
                    Male
                  </CDropdownItem>
                  <CDropdownItem
                    onClick={() => setParams(prevState => ({
                      ...prevState,
                      gender: 'female'
                    }))}
                  >
                    Female
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </>
          )
        }}
      />
      <CPagination
        style={{ marginTop: 20 }}
        align={'center'}
        pages={10}
        activePage={params.page}
        onActivePageChange={onChangePage}
      />
    </div>
  )
}
