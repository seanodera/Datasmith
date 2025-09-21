#include <fstream>
#include <iostream>
#include <list>
#include <sstream>
#include <optional>

using namespace std;

struct Metadata {
    int total_rows;
    int total_columns;
    vector<string> columns;
    unordered_map<string, string> data_types;
    string memory_usage;
};

struct DuplicateAnalysis {
    int duplicate_count;
    int unique_count;
    double duplicate_percentage;
    // TS had string | number | null → use optional<string>
    optional<string> most_common_value;
    int most_common_count;
};

struct NumericalAnalysis {
    std::optional<double> mean;
    optional<double> median;
    optional<double> min;
    optional<double> max;
    optional<double> std;
    optional<double> q1;
    optional<double> q3;
    int missing_values;
    int zero_values;
};

struct CategoricalAnalysis {
    int unique_values;
    unordered_map<string, int> value_distribution;
    optional<string> most_common_value;
    int most_common_count;
    int missing_values;
};

struct DataQuality {
    int complete_duplicates_count;
    int total_missing_values;
    unordered_map<string, int> missing_values_by_column;
};

struct AnalysisResults {
    string analysis_id;
    string analysis_timestamp;
    Metadata metadata;
    unordered_map<string, DuplicateAnalysis> duplicate_analysis;
    unordered_map<string, NumericalAnalysis> numerical_analysis;
    unordered_map<string, CategoricalAnalysis> categorical_analysis;
    DataQuality data_quality;
};

struct AnalysisResponse {
    string filename;
    string analysis_id;
    AnalysisResults results;

    AnalysisResponse() = default;

    AnalysisResponse(const string & filename, const char * str);
};

int main() {
    cout << "Hello, Datasmith!" << endl;

    const string filename = "/Users/seanolero/projects/Datasmith/cpp-mod/data.csv";

    char header;
    cout << "Read header? (y/n): ";
    cin >> header;
    ifstream file(filename);

    if (!file.is_open()) {
        cerr << "Error: Could not open file " << filename << endl;
        return 1; // Exit with error
    }
    AnalysisResponse response;
    response.filename = filename;
    response.analysis_id = "12345";
    int columns = 0;


    if (header == 'y' || header == 'Y') {
        string headerLine;
        getline(file, headerLine); // Read the first line
        cout << "Read header: " << headerLine << endl;

        vector<string> headers;
        stringstream ss(headerLine);
        string column;

        while (getline(ss, column, ',')) {
            headers.push_back(column);
        }

        response.results.metadata.columns = headers;
        // Print headers
        cout << "Split headers:" << endl;
        for (const string& h : headers) {
            columns++;
            cout << "- " << h << endl;
        }
    }
    response.results.metadata.total_columns = columns;

    vector<vector<string>> values = {};

    string line;
    int rows = 0;
    while (getline(file, line)) {// Read line by line
        rows++;
        stringstream ss(line);
        string data;

        cout << "Read line: " << line << endl;
    }

    response.results.metadata.total_rows = rows;

    //create data grid

    return 0;
}


Metadata generateMetadata(Metadata& metadata) {

    return metadata;
}