import { configureStore } from "@reduxjs/toolkit";
import { themeReducer } from "./themeslice";
import { localKanbanReducer } from "./localKanbanSlice";

import storage from "redux-persist/lib/storage";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// Seul localKanban est persisté — le thème repart à darkmode au rechargement
const localKanbanPersistConfig = {
  key: "localKanban",
  storage,
};

const persistedLocalKanbanReducer = persistReducer(
  localKanbanPersistConfig,
  localKanbanReducer,
);

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    localKanban: persistedLocalKanbanReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
