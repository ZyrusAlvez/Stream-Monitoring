import streamlit as st

st.set_page_config(initial_sidebar_state="collapsed")
hide_sidebar = """
    <style>
        section[data-testid="stSidebar"] {display: none !important;}
        div[data-testid="stSidebarNav"] {display: none !important;}
        button[kind="headerNoPadding"] {display: none !important;}
    </style>
"""
st.markdown(hide_sidebar, unsafe_allow_html=True)


st.title("TV.GARDEN")
st.write("This is the TV.GARDEN page.")
