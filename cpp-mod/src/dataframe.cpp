//
// dataframe.h
//
#pragma once
#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>
#include <cmath>
#include <numeric>
#include <optional>
#include <cstddef>

using namespace std;

struct Column {
    string name;
    string dataType; // "int", "double", "string"
    vector<optional<string>> data; // raw storage, missing = nullopt
};

class DataFrame {
private:
    string filename;
    string rawData;

public:
    vector<Column> columns;

    // ---- CSV ----
    DataFrame readCSV(const string& filename);
    void head(int number);
    void tail(int number);

    // ---- Attributes / Underlying data ----
    vector<int> index(); // row labels
    vector<string> get_columns(); // column labels
    vector<string> dtypes(); // dtype of each column
    void info(bool verbose = true, int max_cols = 10); // summary
    DataFrame select_dtypes(vector<string> include = {}, vector<string> exclude = {});
    vector<vector<optional<string>>> values(); // 2D array
    vector<string> axes(); // ["index", "columns"]
    int ndim(); // number of dimensions
    size_t size(); // number of elements
    pair<size_t, size_t> shape(); // (rows, cols)
    vector<size_t> memory_usage(bool deep = false);
    bool empty();
    void set_flags(); // placeholder

    // ---- Conversion ----
    void astype(const string& dtype);
    void convert_dtypes();
    void infer_objects();
    DataFrame copy();
    bool to_bool(); // deprecated
    vector<vector<optional<string>>> to_numpy();

    // ---- Indexing & Iteration ----
    string at(size_t row, const string& col);
    string iat(size_t row, size_t col);
    vector<vector<string>> loc(const vector<int>& rows, const vector<string>& cols);
    vector<vector<string>> iloc(const vector<int>& rows, const vector<int>& cols);
    void insert(size_t loc, const string& column, const vector<string>& value);
    vector<string>::iterator begin();
    vector<string>::iterator end();
    vector<pair<string, vector<optional<string>>>> items();
    vector<string> keys();
    vector<pair<int, vector<string>>> iterrows();
    vector<vector<string>> itertuples(bool index = true, const string& name = "Row");
    Column pop(const string& item);
    vector<optional<string>> xs(size_t key, int axis = 0);
    vector<optional<string>> get(const string& key);

    // ---- Boolean operations ----
    vector<vector<bool>> isin(const vector<string>& values);
    DataFrame where(vector<vector<bool>> cond, const string& other = "NaN");
    DataFrame mask(vector<vector<bool>> cond, const string& other = "NaN");
    DataFrame query(const string& expr);
};