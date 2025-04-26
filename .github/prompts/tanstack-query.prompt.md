# TanStack Query データフェッチングプロンプト

データフェッチの対象が指定されていない場合は、対象となるデータの種類について質問してください。

## データフェッチング要件

以下の要件に従って、TanStack Query（React Query）を使用したデータフェッチングコードを生成してください：

1. **カスタムフック**: 再利用可能なカスタムフックとして実装する
2. **TypeScript**: 戻り値、パラメータ、エラー型などを適切に定義する
3. **キャッシュ管理**: 適切なキャッシュキーとオプションを設定する
4. **ローディング状態**: ローディング状態の適切な処理
5. **エラーハンドリング**: エラーの適切な処理とリトライ設定
6. **データ変換**: 必要に応じてデータを変換して使いやすい形にする
7. **依存関係**: クエリの依存関係を適切に設定する
8. **リアクティブ**: パラメータ変更時の自動再取得を適切に設定
9. **無限スクロール**: 必要に応じて無限スクロールのサポートを実装
10. **楽観的更新**: ミューテーションの楽観的更新を適切に実装

## ファイル構造

データフェッチング関連のファイルは以下のように構成することを推奨します：

```
src/
  features/
    {feature}/
      api/
        queries.ts  # useQueryフックを実装
        mutations.ts # useMutationフックを実装
        types.ts    # API関連の型定義
      hooks/
        useDataHooks.ts # ビジネスロジックを含むフック
```

## コード構造：クエリフック

```tsx
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { apiClient } from '@/lib/api-client';

// データ型の定義
export interface DataType {
  id: string;
  // その他のプロパティ
}

// レスポンス型の定義
export interface ApiResponse {
  data: DataType[];
  // その他のレスポンスプロパティ
}

// クエリキーの定義
export const dataQueryKeys = {
  all: ['data'] as const,
  lists: () => [...dataQueryKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...dataQueryKeys.lists(), filters] as const,
  details: () => [...dataQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...dataQueryKeys.details(), id] as const,
};

// データ取得関数
export const fetchData = async (filters?: Record<string, unknown>): Promise<ApiResponse> => {
  const response = await apiClient.get<ApiResponse>('/api/endpoint', {
    params: filters,
  });
  return response.data;
};

// カスタムクエリフック
export function useDataQuery(
  filters?: Record<string, unknown>,
  options?: UseQueryOptions<ApiResponse, AxiosError, DataType[], ReturnType<typeof dataQueryKeys.list>> 
) {
  return useQuery({
    queryKey: dataQueryKeys.list(filters || {}),
    queryFn: () => fetchData(filters),
    staleTime: 5 * 60 * 1000, // 5分間はキャッシュを使用
    ...options,
  });
}

// 詳細データ取得関数
export const fetchDataById = async (id: string): Promise<DataType> => {
  const response = await apiClient.get<DataType>(`/api/endpoint/${id}`);
  return response.data;
};

// 詳細データ用カスタムクエリフック
export function useDataDetailQuery(
  id: string,
  options?: UseQueryOptions<DataType, AxiosError, DataType, ReturnType<typeof dataQueryKeys.detail>> 
) {
  return useQuery({
    queryKey: dataQueryKeys.detail(id),
    queryFn: () => fetchDataById(id),
    staleTime: 10 * 60 * 1000, // 10分間はキャッシュを使用
    ...options,
    enabled: !!id && (options?.enabled !== false),
  });
}
```

## コード構造：ミューテーションフック

```tsx
import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { apiClient } from '@/lib/api-client';
import { dataQueryKeys, DataType } from './queries';

// データ作成用の型
export interface CreateDataDTO {
  // 作成に必要なフィールド
}

// データ更新用の型
export interface UpdateDataDTO {
  id: string;
  // 更新に必要なフィールド
}

// データ作成関数
export const createData = async (data: CreateDataDTO): Promise<DataType> => {
  const response = await apiClient.post<DataType>('/api/endpoint', data);
  return response.data;
};

// データ更新関数
export const updateData = async (data: UpdateDataDTO): Promise<DataType> => {
  const response = await apiClient.put<DataType>(`/api/endpoint/${data.id}`, data);
  return response.data;
};

// データ削除関数
export const deleteData = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/endpoint/${id}`);
};

// データ作成用ミューテーションフック
export function useCreateDataMutation(
  options?: UseMutationOptions<DataType, AxiosError, CreateDataDTO>
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createData,
    onSuccess: (data) => {
      // キャッシュを更新
      queryClient.invalidateQueries({ queryKey: dataQueryKeys.lists() });
      // 他の成功時の処理
    },
    ...options,
  });
}

// データ更新用ミューテーションフック
export function useUpdateDataMutation(
  options?: UseMutationOptions<DataType, AxiosError, UpdateDataDTO>
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateData,
    onSuccess: (data) => {
      // 詳細ビューのキャッシュを更新
      queryClient.setQueryData(dataQueryKeys.detail(data.id), data);
      // リストビューのキャッシュも無効化
      queryClient.invalidateQueries({ queryKey: dataQueryKeys.lists() });
      // 他の成功時の処理
    },
    ...options,
  });
}

// データ削除用ミューテーションフック
export function useDeleteDataMutation(
  options?: UseMutationOptions<void, AxiosError, string>
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteData,
    onSuccess: (_, id) => {
      // キャッシュを無効化
      queryClient.removeQueries({ queryKey: dataQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: dataQueryKeys.lists() });
      // 他の成功時の処理
    },
    ...options,
  });
}
```