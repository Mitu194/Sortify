#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#define MAXN 100
int a[MAXN], n, descending = 0;
long comparisons = 0, swaps = 0, writes = 0, passes = 0;
int before(int x, int y) { return descending ? x > y : x < y; }
int out_of_order(int x, int y) { return descending ? x < y : x > y; }

void emit(const char *type, int i, int j, int line, const char *message,
          int x, int y, int key, int low, int high)
{
    printf("{\"type\":\"%s\",\"i\":%d,\"j\":%d,\"line\":%d,", type, i, j, line);
    printf("\"message\":\"%s\",\"values\":[", message);
    for (int k = 0; k < n; k++)
        printf("%s%d", k ? "," : "", a[k]);
    printf("],\"vars\":{\"i\":%d,\"j\":%d,\"x\":%d,\"y\":%d,\"key\":%d,\"low\":%d,\"high\":%d},", i, j, x, y, key, low, high);
    printf("\"counts\":{\"comparisons\":%ld,\"swaps\":%ld,\"writes\":%ld,\"passes\":%ld}}\n",
           comparisons, swaps, writes, passes);
    fflush(stdout);
}
void begin_pass(const char *msg)
{
    passes++;
    emit("pass", -1, -1, __LINE__, msg,
         -1, -1, -1, -1, -1);
}

void compare_event(int i, int j, int line, const char *msg)
{
    comparisons++;
    emit("compare", i, j, line, msg, i >= 0 && i < n ? a[i] : -1, j >= 0 && j < n ? a[j] : -1, -1, -1, -1);
}
void swap_event(int i, int j, int line, const char *msg)
{
    int t = a[i];
    a[i] = a[j];
    a[j] = t;
    swaps++;
    writes += 2;
    emit("swap", i, j, line, msg, a[i], a[j], -1, -1, -1);
}
void write_event(int i, int value, int line, const char *msg, int key, int low, int high)
{
    a[i] = value;
    writes++;
    emit("write", i, -1, line, msg, value, -1, key, low, high);
}
void mark_event(int line, const char *msg)
{
    emit("mark", -1, -1, line, msg, -1, -1, -1, -1, -1);
}

void bubble_sort(void)
{
    for (int i = 0; i < n - 1; i++)
    {
        begin_pass("Bubble Sort - Pass started");

        int changed = 0;

        for (int j = 0; j < n - i - 1; j++)
        {
            compare_event(j, j + 1, __LINE__,
                          "Compare adjacent elements");

            if (out_of_order(a[j], a[j + 1]))
            {
                swap_event(j, j + 1, __LINE__,
                           "Swap because elements are out of order");
                changed = 1;
            }
        }

        mark_event(__LINE__, "End of pass");

        if (!changed)
            break;
    }
}
void selection_sort(void)
{
    for (int i = 0; i < n - 1; i++)
    {
        begin_pass("Selection Sort - Finding minimum");

        int min = i;

        for (int j = i + 1; j < n; j++)
        {
            compare_event(min, j, __LINE__,
                          "Compare current minimum with next element");

            if (before(a[j], a[min]))
                min = j;
        }

        if (min != i)
        {
            swap_event(i, min, __LINE__,
                       "Place minimum at the start of the unsorted section");
        }

        mark_event(__LINE__, "Selection pass completed");
    }
}
void insertion_sort(void)
{
    for (int i = 1; i < n; i++)
    {
        begin_pass("Insertion Sort - Inserting element");

        int key = a[i], j = i - 1;

        emit("key", i, j, __LINE__,
             "Store the current element as key",
             a[i], j, key, -1, -1);

        while (j >= 0)
        {
            compare_event(j, i, __LINE__,
                          "Compare key with previous element");

            if (!out_of_order(a[j], key))
                break;

            int v = a[j];

            write_event(j + 1, v, __LINE__,
                        "Shift element one position right",
                        key, -1, -1);

            j--;
        }

        write_event(j + 1, key, __LINE__,
                    "Insert key into correct position",
                    key, -1, -1);

        mark_event(__LINE__, "Sorted prefix expanded");
    }
}
void merge_ranges(int l, int m, int r)
{
    begin_pass("Merge Sort - Merging subarrays");
    int temp[MAXN], i = l, j = m + 1, k = 0;
    while (i <= m && j <= r)
    {
        compare_event(i, j, __LINE__ + 1, "Compare the front elements of both halves");
        if (before(a[i], a[j]))
            temp[k++] = a[i++];
        else
            temp[k++] = a[j++];
    }
    while (i <= m)
        temp[k++] = a[i++];
    while (j <= r)
        temp[k++] = a[j++];
    for (i = 0; i < k; i++)
    {
        write_event(l + i, temp[i], __LINE__,
                    "Copy merged value back into the array",
                    -1, l, r);
    }
    mark_event(__LINE__, "Two sorted halves have been merged");
}
void merge_rec(int l, int r)
{
    if (l >= r)
        return;
    int m = l + (r - l) / 2;
    emit("range", l, r, __LINE__, "Divide the current range into two halves", -1, -1, -1, l, r);
    merge_rec(l, m);
    merge_rec(m + 1, r);
    merge_ranges(l, m, r);
}
void merge_sort(void) { merge_rec(0, n - 1); }

int partition(int low, int high)
{
    int pivot = a[high], i = low - 1;
    emit("pivot", high, low, __LINE__, "Choose the last element as pivot", pivot, -1, pivot, low, high);
    begin_pass("Quick Sort - Partitioning array");
    for (int j = low; j < high; j++)
    {
        compare_event(j, high, __LINE__ + 1, "Compare current element with pivot");
        if (descending ? a[j] >= pivot : a[j] <= pivot)
        {
            i++;
            if (i != j)
                swap_event(i, j, __LINE__, "Move an element to the pivot's left partition");
        }
    }
    if (i + 1 != high)
        swap_event(i + 1, high, __LINE__, "Place pivot in its final position");
    mark_event(__LINE__, "Partition completed");
    return i + 1;
}
void quick_rec(int low, int high)
{
    if (low < high)
    {
        int p = partition(low, high);
        quick_rec(low, p - 1);
        quick_rec(p + 1, high);
    }
}
void quick_sort(void)
{
    quick_rec(0, n - 1);
}

void heapify(int size, int root)
{
    int best = root, left = 2 * root + 1, right = 2 * root + 2;
    if (left < size)
    {
        compare_event(left, best, __LINE__ + 1, "Compare left child with parent");
        if (before(a[best], a[left]))
            best = left;
    }
    if (right < size)
    {
        compare_event(right, best, __LINE__ + 1, "Compare right child with current largest");
        if (before(a[best], a[right]))
            best = right;
    }
    if (best != root)
    {
        swap_event(root, best, __LINE__, "Swap parent with selected child");
        heapify(size, best);
    }
}
void heap_sort(void)
{
    // Pass 1: Build the initial heap
    if (n > 1)
    {
        begin_pass("Heap Sort - Building initial heap");
    }

    for (int i = n / 2 - 1; i >= 0; i--)
    {
        heapify(n, i);
    }

    mark_event(__LINE__, "Heap construction completed");

    // Remaining passes: Extract elements
    for (int i = n - 1; i > 0; i--)
    {
        begin_pass("Heap Sort - Extracting root");

        swap_event(0, i, __LINE__,
                   "Move heap root to the end");

        heapify(i, 0);
    }

    mark_event(__LINE__, "Heap sort completed");
}
int main(void)
{
    char algo[32], order[16];
    if (scanf("%31s %15s %d", algo, order, &n) != 3 || n < 1 || n > MAXN)
    {
        fprintf(stderr, "Invalid input\n");
        return 1;
    }
    descending = strcmp(order, "desc") == 0;
    for (int i = 0; i < n; i++)
        if (scanf("%d", &a[i]) != 1)
            return 1;

    if (!strcmp(algo, "bubble"))
        bubble_sort();
    else if (!strcmp(algo, "selection"))
        selection_sort();
    else if (!strcmp(algo, "insertion"))
        insertion_sort();
    else if (!strcmp(algo, "merge"))
        merge_sort();
    else if (!strcmp(algo, "quick"))
        quick_sort();
    else if (!strcmp(algo, "heap"))
        heap_sort();
    else
    {
        fprintf(stderr, "Unknown algorithm\n");
        return 1;
    }

    mark_event(__LINE__, "Sorting completed");
    return 0;
}
