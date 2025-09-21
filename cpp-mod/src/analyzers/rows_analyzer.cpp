#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <any>
using namespace std;



void analyzeRow(const unordered_map<string, any>& row) {
    for (const auto& [key, value] : row) {
        std::cout << "Key: " << key << " | ";

        if (value.type() == typeid(int)) {
            std::cout << "Value (int): " << std::any_cast<int>(value);
        } else if (value.type() == typeid(double)) {
            std::cout << "Value (double): " << std::any_cast<double>(value);
        } else if (value.type() == typeid(std::string)) {
            std::cout << "Value (string): " << std::any_cast<std::string>(value);
        } else {
            std::cout << "Value (unknown type)";
        }
        std::cout << std::endl;
    }
}

void analyzeData(const unordered_map<string, any>& data) {
    for (const auto& [key, value]: data){
        
    }
}