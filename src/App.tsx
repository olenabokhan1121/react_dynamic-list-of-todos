/* eslint-disable max-len */
import React, { useEffect, useMemo, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { Todo } from './types/Todo';
import { getTodos } from './api';

export const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selected, setSelected] = useState<Todo>();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');

  const visibleTodos = useMemo(() => {
    let todoFiltered = [...todos];

    if (query) {
      todoFiltered = todoFiltered.filter(todo =>
        todo.title.toLowerCase().includes(query.toLowerCase()),
      );
    }

    if (status !== 'all') {
      switch (status) {
        case 'completed':
          todoFiltered = todoFiltered.filter(todo => todo.completed);
          break;
        case 'active':
          todoFiltered = todoFiltered.filter(todo => !todo.completed);
          break;
      }
    }

    return todoFiltered;
  }, [todos, query, status]);

  function handleSelectTodo(todo: Todo | undefined) {
    setSelected(todo);
  }

  function handleQuery(searchQuery: string) {
    setQuery(searchQuery);
  }

  function handleSelect(selectedStatus: string) {
    setStatus(selectedStatus);
  }

  useEffect(() => {
    setLoading(true);
    getTodos()
      .then(goodsFromServer => {
        setTodos(goodsFromServer);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                onSelectedStatus={handleSelect}
                onQuery={handleQuery}
                value={query}
              />
            </div>

            <div className="block">
              {loading && <Loader />}
              <TodoList
                visibleTodos={visibleTodos}
                onSelect={handleSelectTodo}
                todoId={selected?.id}
              />
            </div>
          </div>
        </div>
      </div>

      {selected && (
        <TodoModal selectedTodo={selected} onClose={handleSelectTodo} />
      )}
    </>
  );
};
