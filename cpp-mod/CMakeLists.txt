cmake_minimum_required(VERSION 3.16)  # pick a version available on your system
project(new_target LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

add_executable(new_target main.cpp
        src/dataframe.cpp
        src/analyzers/cols_analyzer.cpp)