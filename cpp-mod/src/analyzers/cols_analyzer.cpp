//
// Created by sean olero on 12/09/2025.
//

#include "cols_analyzer.h"
#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <optional> // for std::optional

using namespace std;

struct Duplicate {
    auto value;
    int count;
};

struct DuplicateAnalysis {
    int duplicate_count;
    int unique_count;
    double duplicate_percentage;
    optional<auto> most_common_value;
    int most_common_count;
    optional<vector<Duplicate>> duplicates;
};

DuplicateAnalysis analyzeColumnDuplicate(const vector<string>& values) {
    // Print all values
    for (const auto& value : values) {
        cout << value << endl;
    }

    // Track counts using a hash map
    unordered_map<string, int> freq;
    for (const auto& value : values) {
        freq[value]++;
    }

    vector<string> uniqueValues;
    vector<Duplicate> duplicates;

    int most_common_count = 0;
    optional<string> most_common_value;

    for (const auto& [val, count] : freq) {
        if (count == 1) {
            uniqueValues.push_back(val);
        } else {
            duplicates.push_back({val, count});
        }

        if (count > most_common_count) {
            most_common_count = count;
            most_common_value = val;
        }
    }

    int duplicate_count = 0;
    for (const auto& d : duplicates) {
        duplicate_count += d.count;
    }

    int unique_count = uniqueValues.size();
    double duplicate_percentage = values.empty()
        ? 0.0
        : static_cast<double>(duplicate_count) / values.size() * 100.0;

    cout << "\nUnique values:\n";
    for (const auto& val : uniqueValues) {
        cout << val << endl;
    }

    cout << "\nDuplicates:\n";
    for (const auto& d : duplicates) {
        cout << d.value << " appears " << d.count << " times\n";
    }

    return {
        duplicate_count,
        unique_count,
        duplicate_percentage,
        most_common_value,
        most_common_count,
        duplicates
    };
}


void analyzeColumnsNumerical(const vector<vector<string>>& data) {
    
}